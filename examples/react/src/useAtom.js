import { useState, useEffect } from "react";
function useAtom(atom) {
  let [value, setValue] = useState(atom.val());

  useEffect(() => {
    let setVal = (v) => {
      setValue(v);
    };

    atom.addWatcher(setVal);

    return () => atom.removeWatcher(setVal);
  }, []);

  return value;
}

export { useAtom };
