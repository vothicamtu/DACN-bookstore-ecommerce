interface Book {
    id: number;

    title: string;

    imageUrl: string;

    authorName: string;

    price: number;
}

interface BookCardProps {
    book: Book;
}

export default function BookCard({
                                     book,
                                 }: BookCardProps) {

    return (
        <div className="bg-[#EFE2B6] rounded-[28px] p-5 hover:shadow-xl transition-all">

            <div style={{ overflow: 'hidden', borderRadius: '22px', height: '320px', backgroundColor: '#fff' }}>

                <img
                    src={book.imageUrl}
                    alt={book.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>

            <div className="mt-5">

                <h3 className="font-semibold text-lg line-clamp-2 min-h-[60px]">
                    {book.title}
                </h3>

                <p className="text-[#7B6A4A] mt-2 text-sm">
                    {book.authorName}
                </p>

                <div className="mt-5 text-2xl font-bold text-[#A46A1F]">
                    {Number(book.price).toLocaleString()}đ
                </div>
            </div>
        </div>
    );
}