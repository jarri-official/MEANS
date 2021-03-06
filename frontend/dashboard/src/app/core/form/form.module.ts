import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseFormControlComponent} from './base-form-control/base-form-control.component';
import {InputComponent} from './input/input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LabelComponent } from './label/label.component';
import { FormComponent } from './form/form.component';

const COMPONENTS = [
    InputComponent,
    BaseFormControlComponent,
    LabelComponent,
    FormComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class FormModule {
}
