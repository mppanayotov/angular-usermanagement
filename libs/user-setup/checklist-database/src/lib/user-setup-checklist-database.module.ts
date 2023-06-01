import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSetupChecklistDatabaseService } from './checklist-database.service';

@NgModule({
  imports: [CommonModule],
  providers: [UserSetupChecklistDatabaseService],
})
export class UserSetupChecklistDatabaseModule {}
