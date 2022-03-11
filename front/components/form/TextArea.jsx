import { useFormikContext } from "formik";
import React from "react";

const Textarea = ({ name, ...rest }) => {
  const { setFieldTouched, setFieldValue, values, errors, touched } =
    useFormikContext() ?? {};

  return (
    <div className="form-control">
      <textarea
        className={`textarea textarea-bordered h-24 ${
          errors[name] && touched[name] && "textarea-error"
        }`}
        onChange={(e) => setFieldValue(name, e.target.value)}
        value={values[name]}
        onBlur={() => setFieldTouched(name)}
        name={name}
        {...rest}
      ></textarea>
      <label className="label">
        <span className="label-text-alt">
          {errors[name] && touched[name] ? errors[name] : ""}
        </span>
      </label>
    </div>
  );
};

export default Textarea;
