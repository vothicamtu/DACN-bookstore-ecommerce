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
        <aside className="bookland-filters">
            <div className="bookland-filterPanel">
                <div className="bookland-filterGroup">
                    <h2>DANH MỤC</h2>

                    <div className="bookland-chipList">
                        <button
                            type="button"
                            onClick={() => setCategoryId("")}
                            className={`bookland-chip ${categoryId === "" ? "is-active" : ""}`}
                        >
                            Tất cả
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() =>
                                    setCategoryId(categoryId === category.id ? "" : category.id)
                                }
                                className={`bookland-chip ${categoryId === category.id ? "is-active" : ""}`}
                            >
                                {category.categoryName}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bookland-filterGroup">
                    <h2>KHOẢNG GIÁ</h2>

                    <div className="bookland-priceRange">
                        <label>
                            <span>Từ</span>
                            <input
                                type="number"
                                min="0"
                                step="10000"
                                placeholder="Giá thấp nhất"
                                value={minPrice}
                                onChange={(e) =>
                                    setMinPrice(e.target.value)
                                }
                            />
                        </label>

                        <label>
                            <span>Đến</span>
                            <input
                                type="number"
                                min="0"
                                step="10000"
                                placeholder="Giá cao nhất"
                                value={maxPrice}
                                onChange={(e) =>
                                    setMaxPrice(e.target.value)
                                }
                            />
                        </label>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onSearch}
                    className="bookland-filterReset bookland-filterApply"
                >
                    Áp dụng bộ lọc
                </button>
            </div>
        </aside>
    );
}
