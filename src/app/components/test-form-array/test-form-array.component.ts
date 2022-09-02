import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-test-form-array',
  templateUrl: './test-form-array.component.html',
  styleUrls: ['./test-form-array.component.scss']
})
export class TestFormArrayComponent implements OnInit {

  form = this.fb.group({
    status: this.fb.array([])
  });

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {}
  
  get status() {
    return this.form.controls["status"] as FormArray;
  }

  addFolder() {
    const folderForm = this.fb.group({
      title: ['', Validators.required],
      status: ['notstarted', Validators.required],
     
    });
    this.status.push(folderForm);
    console.log(folderForm.value);
    console.log('Status : ', this.status.value);
  }

  deleteFolder(statusIndex: number) {
    this.status.removeAt(statusIndex);
  }
}