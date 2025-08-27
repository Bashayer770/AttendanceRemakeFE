import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/locations/locationService';
import { Location } from '../../models/locations';
import { CommonModule } from '@angular/common';
import { AddLocationModalComponent } from './components/add/add-location-modal.component';
import { EditLocationModalComponent } from './components/edit/edit-location-modal.component';
import { DeleteLocationModalComponent } from './components/delete/delete-location-modal.component';
import { EditSquareComponent } from '../../../assets/SVG/editSVG.component';
import { DeleteFilledComponent } from '../../../assets/SVG/deleteSVG.component';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddLocationModalComponent,
    EditLocationModalComponent,
    DeleteLocationModalComponent,
    EditSquareComponent,
    DeleteFilledComponent,
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css',
})
export class LocationComponent implements OnInit {
  allLocations: Location[] = [];
  filteredLocations: Location[] = [];
  searchQuery: string = '';

  isAddModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;

  editingLocation: Location | null = null;
  codeToDelete: number | null = null;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.fetchAll();
  }

  fetchAll(): void {
    this.locationService.getAll().subscribe({
      next: (locations: Location[]) => {
        console.log('Fetched locations', locations);
        this.allLocations = locations;
        this.filteredLocations = locations;
      },
      error: (err) => console.error('Fetch failed', err),
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredLocations = this.allLocations.filter(
      (loc) =>
        loc.descA.toLowerCase().includes(q) ||
        loc.descE.toLowerCase().includes(q)
    );
  }

  openAddModal(): void {
    this.isAddModalVisible = true;
  }

  openEditModal(location: Location): void {
    this.editingLocation = location;
    this.isEditModalVisible = true;
  }

  onAddSubmit(formData: any): void {
    const location: Location = {
      code: 0,
      descA: formData.descA,
      descE: formData.descE,
    };

    this.locationService.create(location).subscribe({
      next: () => {
        this.fetchAll();
        this.closeAddModal();
      },
      error: (err) => console.error('Create failed', err),
    });
  }

  onEditSubmit(updatedLocation: Location): void {
    this.locationService
      .update(updatedLocation.code, updatedLocation)
      .subscribe({
        next: () => {
          this.fetchAll();
          this.closeEditModal();
        },
        error: (err) => console.error('Update failed', err),
      });
  }

  trackByCode(index: number, item: Location): number {
    return item.code;
  }

  openDeleteModal(code: number): void {
    console.log('Open delete modal for code:', code);
    this.codeToDelete = code;
    this.isDeleteModalVisible = true;
  }

  confirmDelete(): void {
    if (this.codeToDelete !== null) {
      this.locationService.delete(this.codeToDelete).subscribe({
        next: () => {
          this.fetchAll();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.closeDeleteModal();
        },
      });
    }
  }

  closeAddModal(): void {
    this.isAddModalVisible = false;
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.editingLocation = null;
  }

  closeDeleteModal(): void {
    this.isDeleteModalVisible = false;
    this.codeToDelete = null;
  }
}
