import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-label-editable",
  templateUrl: "./label-editable.component.html",
  styleUrls: ["./label-editable.component.scss"],
})
export class LabelEditableComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() edit: boolean;
  @Input() visible: boolean;
  @Input() editable: boolean;
  @Input() label: string;
  @Input() position: string;
  @Output() saveLabel: EventEmitter<any> = new EventEmitter(null);
  @ViewChild("nameInput") el: ElementRef;
  renderTemplate: boolean = false;
  loadinglabel: boolean;

  constructor() {}

  @HostListener("click", ["$event.target"])
  onClick(classname) {
    const className = (classname as Element).className;
    if (
      className ===
        "mat-tooltip-trigger text-gray-900 font-medium cursor-pointer ng-star-inserted" ||
      className === "label-edit cursor-pointer ng-star-inserted" ||
      className === "label-edit cursor-pointer"
    ) {
      this.editLabelFn();
    }
  }

  ngOnInit(): void {
    this.renderTemplate = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.edit) {
      this.edit = this.loadinglabel = changes.edit?.currentValue;
    }
  }

  ngAfterViewInit(): void {}

  editLabelFn(): void {
    this.edit = true;
    setTimeout(() => {
      this.el.nativeElement.select();
    });
  }

  saveLabelFn(): void {
    this.loadinglabel = true;
    this.saveLabel.emit(this.label);
  }
}
