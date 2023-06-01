import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSetupChecklistTreeService } from './checklist-tree.service';

@NgModule({
  imports: [CommonModule],
  providers: [UserSetupChecklistTreeService],
})
export class UserSetupChecklistTreeModule {}
