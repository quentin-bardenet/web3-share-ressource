import { useFormikContext } from "formik";
import React from "react";

const Input = ({ name, type = "text", className = "", ...rest }) => {
  const { setFieldTouched, setFieldValue, values, errors, touched } =
    useFormikContext() ?? {};

  return (
    <div className="form-control w-full max-w-xs">
      <input
        className={`input input-bordered w-full max-w-xs ${
          errors && errors[name] && touched[name] && "input-error"
        } ${className}`}
        onChange={(e) => setFieldValue(name, e.target.value)}
        value={values && values[name]}
        onBlur={() => setFieldTouched(name)}
        name={name}
        type={type}
        {...rest}
      />
      <label className="label">
        <span className="label-text-alt">
          {errors && errors[name] && touched[name] ? errors[name] : ""}
        </span>
      </label>
    </div>
  );
};

export default Input;
