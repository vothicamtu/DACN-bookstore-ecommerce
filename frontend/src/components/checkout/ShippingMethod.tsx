export type ShippingMethodValue = "standard" | "express";

interface Props {
  value: ShippingMethodValue;
  onChange: (value: ShippingMethodValue) => void;
}

export default function ShippingMethod({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-[28px] border border-[#E5D8BA] p-8">
      <h2 className="text-4xl font-semibold mb-8">PhÆ°Æ¡ng thá»©c váº­n chuyá»ƒn</h2>

      <div className="grid grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => onChange("standard")}
          className={`
          border rounded-2xl p-6 cursor-pointer text-left

          ${value === "standard" ? "border-[#A46A1F]" : "border-[#E5D8BA]"}
          `}
        >
          <p className="font-semibold">TiÃªu chuáº©n</p>
          <p>Dá»± kiáº¿n 2-4 ngÃ y</p>
          <p className="text-[#A46A1F] font-bold">25.000Ä‘</p>
        </button>

        <button
          type="button"
          onClick={() => onChange("express")}
          className={`
          border rounded-2xl p-6 cursor-pointer text-left

          ${value === "express" ? "border-[#A46A1F]" : "border-[#E5D8BA]"}
          `}
        >
          <p className="font-semibold">Há»a tá»‘c</p>
          <p>Giao trong ngÃ y</p>
          <p className="text-[#A46A1F] font-bold">50.000Ä‘</p>
        </button>
      </div>
    </div>
  );
}
