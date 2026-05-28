interface Category {
    id: number;
    categoryName: string;
}

interface FilterSidebarProps {
    categories: Category[];

    categoryId: number | string;

    setCategoryId: React.Dispatch<
        React.SetStateAction<any>
    >;

    minPrice: string;

    setMinPrice: React.Dispatch<
        React.SetStateAction<string>
    >;

    maxPrice: string;

    setMaxPrice: React.Dispatch<
        React.SetStateAction<string>
    >;

    onSearch: () => void;
}

export default function FilterSidebar({

                                          categories,

                                          categoryId,

                                          setCategoryId,

                                          minPrice,

                                          setMinPrice,

                                          maxPrice,

                                          setMaxPrice,

                                          onSearch,

                                      }: FilterSidebarProps) {

    return (
        <aside className="w-[280px] bg-[#EFE2B6] rounded-[28px] p-7 h-fit">

            <h3 className="uppercase text-xs tracking-wider font-semibold mb-5 text-[#7B613A]">
                Danh mục
            </h3>

            <div className="flex flex-wrap gap-3">

                {categories.map((category) => (

                    <button
                        key={category.id}
                        onClick={() =>
                            setCategoryId(categoryId === category.id ? "" : category.id)
                        }
                        className={`px-4 py-2 rounded-full text-sm ${
                            categoryId === category.id
                                ? "bg-[#8C5A1E] text-white"
                                : "bg-[#F8F3E7]"
                        }`}
                    >
                        {category.categoryName}
                    </button>
                ))}
            </div>

            <div className="mt-10">

                <h3 className="uppercase text-xs tracking-wider font-semibold mb-5 text-[#7B613A]">
                    Khoảng giá
                </h3>

                <div className="space-y-4">

                    <input
                        type="number"
                        placeholder="Giá thấp nhất"
                        value={minPrice}
                        onChange={(e) =>
                            setMinPrice(e.target.value)
                        }
                        className="w-full rounded-xl border border-[#D9C187] bg-white px-4 py-3"
                    />

                    <input
                        type="number"
                        placeholder="Giá cao nhất"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(e.target.value)
                        }
                        className="w-full rounded-xl border border-[#D9C187] bg-white px-4 py-3"
                    />
                </div>
            </div>

            <button
                onClick={onSearch}
                className="w-full mt-10 bg-[#8C5A1E] text-white rounded-2xl py-4"
            >
                Áp dụng bộ lọc
            </button>
        </aside>
    );
}