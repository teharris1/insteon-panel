import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators";
import memoizeOne from "memoize-one";
import "../../../homeassistant-frontend/src/components/ha-circular-progress";
import "../../data-table/insteon-data-table";
import { InsteonDataTable, DataTableColumnContainer } from "../../data-table/insteon-data-table";
import type { ALDBRecord, Insteon } from "../../data/insteon";
import type { HomeAssistant } from "../../../homeassistant-frontend/src/types";
import { computeRTLDirection } from "../../../homeassistant-frontend/src/common/util/compute_rtl";

export interface RecordRowData extends ALDBRecord {
  record?: ALDBRecord;
}

@customElement("insteon-aldb-data-table")
export class InsteonALDBDataTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public insteon!: Insteon;

  @property({ type: Boolean }) public narrow = false;

  @property() public records: ALDBRecord[] = [];

  @property({ type: Boolean }) public isLoading = false;

  @property({ type: Boolean }) public showWait = false;

  @query("insteon-data-table") private _dataTable!: InsteonDataTable;

  private _records = memoizeOne((records: ALDBRecord[]) => {
    if (!records) {
      return [];
    }
    const outputRecords: RecordRowData[] = records;

    return outputRecords.map((record) => ({
      ...record,
    }));
  });

  private _columns = memoizeOne(
    (narrow: boolean): DataTableColumnContainer =>
      narrow
        ? {
            in_use: {
              title: this.insteon.localize("aldb.fields.in_use"),
              template: (in_use: boolean) => {
                if (in_use) {
                  return html`${this.hass.localize("ui.common.yes")}`;
                }
                return html`${this.hass.localize("ui.common.no")}`;
              },
              sortable: true,
              width: "22%",
            },
            dirty: {
              title: this.insteon.localize("aldb.fields.modified"),
              template: (dirty: boolean) => {
                if (dirty) {
                  return html`${this.hass.localize("ui.common.yes")}`;
                }
                return html`${this.hass.localize("ui.common.no")}`;
              },
              sortable: true,
              width: "15%",
            },
            target: {
              title: this.insteon.localize("aldb.fields.target"),
              sortable: true,
              grows: true,
            },
            group: {
              title: this.insteon.localize("aldb.fields.group"),
              sortable: true,
              width: "22%",
            },
            is_controller: {
              title: this.insteon.localize("aldb.fields.mode"),
              template: (is_controller: boolean) => {
                if (is_controller) {
                  return html`${this.insteon.localize("aldb.mode.controller")}`;
                }
                return html`${this.insteon.localize("aldb.mode.responder")}`;
              },
              sortable: true,
              width: "22%",
            },
          }
        : {
            mem_addr: {
              title: this.insteon.localize("aldb.fields.id"),
              template: (mem_addr: number) => {
                if (mem_addr < 0) {
                  return html`New`;
                }
                return html`${mem_addr}`;
              },
              sortable: true,
              direction: "desc",
              width: "12%",
            },
            in_use: {
              title: this.insteon.localize("aldb.fields.in_use"),
              template: (in_use: boolean) => {
                if (in_use) {
                  return html`${this.hass.localize("ui.common.yes")}`;
                }
                return html`${this.hass.localize("ui.common.no")}`;
              },
              sortable: true,
              width: "12%",
            },
            dirty: {
              title: this.insteon.localize("aldb.fields.modified"),
              template: (dirty: boolean) => {
                if (dirty) {
                  return html`${this.hass.localize("ui.common.yes")}`;
                }
                return html`${this.hass.localize("ui.common.no")}`;
              },
              sortable: true,
              width: "12%",
            },
            target: {
              title: this.insteon.localize("aldb.fields.target"),
              sortable: true,
              width: "15%",
            },
            target_name: {
              title: this.insteon.localize("aldb.fields.target_device"),
              sortable: true,
              grows: true,
            },
            group: {
              title: this.insteon.localize("aldb.fields.group"),
              sortable: true,
              width: "12%",
            },
            is_controller: {
              title: this.insteon.localize("aldb.fields.mode"),
              template: (is_controller: boolean) => {
                if (is_controller) {
                  return html`${this.insteon.localize("aldb.mode.controller")}`;
                }
                return html`${this.insteon.localize("aldb.mode.responder")}`;
              },
              sortable: true,
              width: "22%",
            },
          }
  );

  private _noDataText(loading): string {
    if (loading) {
      return "";
    }
    return this.insteon.localize("aldb.no_data");
  }

  public clearSelection() {
    this._dataTable.clearSelection();
  }

  protected render(): TemplateResult {
    if (this.showWait) {
      return html` <ha-circular-progress active alt="Loading"></ha-circular-progress> `;
    }
    return html`
      <insteon-data-table
        .columns=${this._columns(this.narrow)}
        .data=${this._records(this.records)}
        .id=${"mem_addr"}
        .dir=${computeRTLDirection(this.hass)}
        .searchLabel=${this.hass.localize("ui.components.data-table.search")}
        .noDataText="${this._noDataText(this.isLoading)}"
      >
        <ha-circular-progress active alt="Loading"></ha-circular-progress>
      </insteon-data-table>
      <div>
        ${this.isLoading
          ? html` <div align="center">${this.insteon.localize("aldb.is_loading")}</div>`
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "insteon-aldb-data-table": InsteonALDBDataTable;
  }
}
