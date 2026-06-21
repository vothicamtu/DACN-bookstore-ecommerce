export default function CartSteps() {
  const steps = ["Giỏ hàng", "Đặt hàng", "Thanh toán", "Hoàn tất"];

  return (
    <div className="flex justify-center gap-10">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`
            w-8 h-8 rounded-full
            flex items-center justify-center

            ${index === 0 ? "bg-[#A46A1F] text-white" : "bg-[#ECE7DA]"}
            `}
          >
            {index + 1}
          </div>

          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}
