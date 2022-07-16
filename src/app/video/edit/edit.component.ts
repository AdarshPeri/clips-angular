import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  clipId = new FormControl('');
  editForm = new FormGroup({ title: this.title, id: this.clipId });
  inProgress = false;
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait, update in progress...';
  @Output() update = new EventEmitter()

  constructor(private modal: ModalService, public clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  ngOnChanges(): void {
    if(!this.activeClip) {
      return;
    }
    this.inProgress = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    if(!this.activeClip) return;
    this.inProgress = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait, update in progress...';

    try {
    await this.clipService.updateClip(this.clipId.value, this.title.value)
    } catch (error) {
      this.inProgress = false;
      this.alertColor = 'red';
      this.alertMessage = 'Oops, try again in some time.'
      return
    }
    this.inProgress = false;
    this.alertColor = 'green';
    this.alertMessage = 'Success!';
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
  }
}
