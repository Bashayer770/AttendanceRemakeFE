import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API } from '../../services/index';

interface DepartmentDto {
  Code: number;
  Name: string;
  EnglishName?: string;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  departments: DepartmentDto[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDepartments();
  }

  private fetchDepartments(): void {
    this.loading = true;
    this.error = null;
    this.http.get<DepartmentDto[]>(API.DEPARTMENTS.GET_ALL).subscribe({
      next: (res) => {
        this.departments = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.error = 'فشل تحميل الأقسام';
        this.loading = false;
      },
    });
  }
}
