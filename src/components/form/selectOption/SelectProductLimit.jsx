/* import { Select } from "@/components/ui/select";
import React from "react";
// import { CODES } from 'currencies-map';

const SelectProductLimit = ({ register, name, label, required }) => {
  return (
    <>
      <Select
        name={name}
        {...register(`${name}`, {
          required: required ? `${label} is required!` : false,
        })}
      >
        <option value="" defaultValue hidden>
          Select Products Limit
        </option>        

        <option value="6">6</option>
        <option value="12">12</option>
        <option value="18">18</option>
      </Select>
    </>
  );
};
export default SelectProductLimit;
 */

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const SelectProductLimit = ({ name, label, required }) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <label className="block mb-2">{label}</label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Products Limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="6">6</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="18">18</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectProductLimit;
