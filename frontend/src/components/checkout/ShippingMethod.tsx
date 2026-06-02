import { useState } from "react";

export default function ShippingMethod() {
  const [shipping, setShipping] = useState("standard");

  return (
    <div className="bg-white rounded-[28px] border border-[#E5D8BA] p-8">
      <h2 className="text-4xl font-semibold mb-8">Phương thức vận chuyển</h2>

      <div className="grid grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => setShipping("standard")}
          className={`
          border rounded-2xl p-6 cursor-pointer text-left

          ${shipping === "standard" ? "border-[#A46A1F]" : "border-[#E5D8BA]"}
          `}
        >
          <p className="font-semibold">Tiêu chuẩn</p>
          <p>Dự kiến 2-4 ngày</p>
          <p className="text-[#A46A1F] font-bold">25.000đ</p>
        </button>

        <button
          type="button"
          onClick={() => setShipping("express")}
          className={`
          border rounded-2xl p-6 cursor-pointer text-left

          ${shipping === "express" ? "border-[#A46A1F]" : "border-[#E5D8BA]"}
          `}
        >
          <p className="font-semibold">Hỏa tốc</p>
          <p>Giao trong ngày</p>
          <p className="text-[#A46A1F] font-bold">50.000đ</p>
        </button>
      </div>
    </div>
  );
}
