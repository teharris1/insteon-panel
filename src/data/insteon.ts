import { HomeAssistant } from "../../homeassistant-frontend/src/types";
import type { HaFormSchema } from "../../homeassistant-frontend/src/components/ha-form/types";
import { Repository, Status, Message } from "./common";
import { ConfigEntry } from "../..//homeassistant-frontend/src/data/config_entries";

export interface Insteon {
  language: string;
  messages: Message[];
  updates: any[];
  resources: any[];
  repositories: Repository[];
  removed: any[];
  config_entry: ConfigEntry;
  sections: any;
  status: Status;
  localize(string: string, replace?: Record<string, any>): string;
  addedToLovelace?(insteon: Insteon, repository: Repository): boolean;
  log: any;
}

export interface InsteonDevice {
  name: string;
  address: string;
  is_battery: boolean;
  aldb_status: string;
}

export interface Property {
  name: string;
  value: number | boolean;
  modified: boolean;
}

export interface PropertiesInfo {
  properties: Property[];
  schema: { [key: string]: HaFormSchema }; // HaFormSchema };
}

export const AddressRegex = RegExp(/(?<!.)[A-Fa-f0-9]{2}\.?[A-Fa-f0-9]{2}\.?[A-Fa-f0-9]{2}$/);

export interface ALDBRecord {
  mem_addr: number;
  in_use: boolean;
  is_controller: boolean;
  highwater: boolean;
  group: number;
  target: string;
  target_name: string;
  data1: number;
  data2: number;
  data3: number;
  dirty: boolean;
}

export const fetchInsteonDevice = (hass: HomeAssistant, id: string): Promise<InsteonDevice> =>
  hass.callWS({
    type: "insteon/device/get",
    device_id: id,
  });

export const fetchInsteonALDB = (hass: HomeAssistant, id: string): Promise<ALDBRecord[]> =>
  hass.callWS({
    type: "insteon/aldb/get",
    device_address: id,
  });

export const fetchInsteonProperties = (hass: HomeAssistant, id: string): Promise<PropertiesInfo> =>
  hass.callWS({
    type: "insteon/properties/get",
    device_address: id,
  });

export const changeALDBRecord = (
  hass: HomeAssistant,
  id: string,
  record: ALDBRecord
): Promise<void> =>
  hass.callWS({
    type: "insteon/aldb/change",
    device_address: id,
    record: record,
  });

export const changeProperty = (
  hass: HomeAssistant,
  id: string,
  name: string,
  value: any
): Promise<void> =>
  hass.callWS({
    type: "insteon/properties/change",
    device_address: id,
    name: name,
    value: value,
  });

export const createALDBRecord = (
  hass: HomeAssistant,
  id: string,
  record: ALDBRecord
): Promise<void> =>
  hass.callWS({
    type: "insteon/aldb/create",
    device_address: id,
    record: record,
  });

export const loadALDB = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/aldb/load",
    device_address: id,
  });

export const loadProperties = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/properties/load",
    device_address: id,
  });

export const writeALDB = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/aldb/write",
    device_address: id,
  });

export const writeProperties = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/properties/write",
    device_address: id,
  });

export const resetALDB = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/aldb/reset",
    device_address: id,
  });

export const resetProperties = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/properties/reset",
    device_address: id,
  });

export const addDefaultLinks = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/aldb/add_default_links",
    device_address: id,
  });

export const aldbRecordLoaded = (hass: HomeAssistant, id: string): Promise<void> =>
  hass.callWS({
    type: "insteon/aldb/record_loaded",
    device_address: id,
  });

export const aldbNewRecordSchema = (insteon: Insteon): HaFormSchema[] => [
  {
    name: "mode",
    options: [
      ["c", insteon.localize("aldb.mode.controller")],
      ["r", insteon.localize("aldb.mode.responder")],
    ],
    required: true,
    type: "select",
  },
  {
    name: "group",
    required: true,
    type: "integer",
    valueMin: -1,
    valueMax: 255,
  },
  {
    name: "target",
    required: true,
    type: "string",
  },
  {
    name: "data1",
    required: true,
    type: "integer",
    valueMin: -1,
    valueMax: 255,
  },
  {
    name: "data2",
    required: true,
    type: "integer",
    valueMin: -1,
    valueMax: 255,
  },
  {
    name: "data3",
    required: true,
    type: "integer",
    valueMin: -1,
    valueMax: 255,
  },
];

export const aldbChangeRecordSchema = (insteon: Insteon): HaFormSchema[] => [
  {
    name: "in_use",
    required: true,
    type: "boolean",
  },
  ...aldbNewRecordSchema(insteon),
];
