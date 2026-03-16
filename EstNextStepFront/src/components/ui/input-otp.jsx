import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const OTPContext = createContext();

export function InputOTP({ children, maxLength = 6, value = "", onChange }) {
  const [values, setValues] = useState(Array(maxLength).fill(""));
  const refs = useRef([]);

  useEffect(() => {
    if (value) {
      const split = value.split("").slice(0, maxLength);
      setValues([...split, ...Array(maxLength - split.length).fill("")]);
    }
  }, [value]);

  const setValue = (index, val) => {
    const newValues = [...values];
    newValues[index] = val.slice(0, 1);
    setValues(newValues);

    onChange?.(newValues.join(""));

    if (val && index + 1 < maxLength) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <OTPContext.Provider value={{ values, setValue, refs }}>
      <div className="flex items-center gap-1">{children}</div>
    </OTPContext.Provider>
  );
}

export function InputOTPGroup({ children }) {
  return <div className="flex gap-1">{children}</div>;
}

export function InputOTPSlot({ index }) {
  const { values, setValue, refs } = useContext(OTPContext);

  return (
    <input
      type="text"
      value={values[index]}
      onChange={(e) => setValue(index, e.target.value)}
      maxLength={1}
      ref={(el) => (refs.current[index] = el)}
      className="w-10 h-10 border rounded text-center focus:outline-none focus:ring focus:ring-blue-500"
    />
  );
}

export function InputOTPSeparator() {
  return <span className="mx-1">-</span>;
}

export function InputOTPDemo({ value, onChange }) {
  return (
    <InputOTP maxLength={6} value={value} onChange={onChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
