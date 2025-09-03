import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodeService } from '../../services/nodes/nodeService';
import { NodeModel } from '../../models/node';
import { AddNodeModalComponent } from './components/add/add-node-modal.component';
import { EditNodeModalComponent } from './components/edit/edit-node-modal.component';
import { DeleteNodeModalComponent } from './components/delete/delete-node-modal.component';
import { EditSquareComponent } from '../../../assets/SVG/editSVG.component';
import { DeleteFilledComponent } from '../../../assets/SVG/deleteSVG.component';

@Component({
  selector: 'app-nodes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddNodeModalComponent,
    EditNodeModalComponent,
    DeleteNodeModalComponent,
    EditSquareComponent,
    DeleteFilledComponent,
  ],
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
})
export class NodesComponent implements OnInit {
  allNodes: NodeModel[] = [];
  filteredNodes: NodeModel[] = [];
  searchQuery: string = '';

  isAddModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;

  editingNode: NodeModel | null = null;
  serialToDelete: string | null = null;

  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll() {
    this.nodeService.getAll().subscribe({
      next: (nodes) => {
        this.allNodes = nodes;
        this.filteredNodes = nodes;
      },
      error: (err) => console.error('Fetch nodes failed', err),
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredNodes = this.allNodes.filter(
      (n) =>
        n.serialNo.toLowerCase().includes(q) ||
        n.descA.toLowerCase().includes(q) ||
        n.descE.toLowerCase().includes(q) ||
        String(n.locCode).includes(q) ||
        (n.floor ?? '').toLowerCase().includes(q)
    );
  }

  openAddModal(): void {
    this.isAddModalVisible = true;
  }

  openEditModal(node: NodeModel): void {
    this.editingNode = node;
    this.isEditModalVisible = true;
  }

  openDeleteModal(serialNo: string): void {
    this.serialToDelete = serialNo;
    this.isDeleteModalVisible = true;
  }

  closeAddModal(): void {
    this.isAddModalVisible = false;
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.editingNode = null;
  }

  closeDeleteModal(): void {
    this.isDeleteModalVisible = false;
    this.serialToDelete = null;
  }
}
