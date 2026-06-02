interface Book {
    id: number;
    title: string;
    imageUrl: string;
    authorName: string;
    price: number;
}

interface BookCardProps {
    book: Book;
    adding?: boolean;
    addToCartError?: string;
    onAddToCart?: (bookId: number) => void;
}

export default function BookCard({
    book,
    adding = false,
    addToCartError = "",
    onAddToCart,
}: BookCardProps) {
    return (
        <article className="bookland-card">
            <div className="bookland-card__cover book-cover--sand">
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="bookland-card__image"
                    style={{
                        opacity: 0.95,
                    }}
                />
                <div className="bookland-card__coverGlow" />
                <div className="bookland-card__coverLabel">BookLand</div>
            </div>

            <div className="bookland-card__body">
                <h3 className="line-clamp-2 min-h-[48px]">
                    {book.title}
                </h3>

                <p className="truncate">
                    {book.authorName}
                </p>

                <div className="bookland-card__priceRow">
                    <span className="bookland-card__price">
                    {Number(book.price).toLocaleString("vi-VN")}đ
                    </span>
                </div>

                {onAddToCart ? (
                    <button
                        type="button"
                        className="bookland-filterReset bookland-card__cartButton"
                        disabled={adding}
                        onClick={() => onAddToCart(book.id)}
                    >
                        {adding ? "Đang thêm..." : "Thêm vào giỏ"}
                    </button>
                ) : null}

                {addToCartError ? (
                    <p className="bookland-cartError">
                        {addToCartError}
                    </p>
                ) : null}
            </div>
        </article>
    );
}
