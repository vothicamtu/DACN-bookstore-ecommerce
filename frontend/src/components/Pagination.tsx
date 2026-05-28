interface PaginationProps {

    page: number;

    totalPages: number;

    setPage: React.Dispatch<
        React.SetStateAction<number>
    >;
}

export default function Pagination({

                                       page,

                                       totalPages,

                                       setPage,

                                   }: PaginationProps) {

    return (
        <div className="flex justify-center gap-3 mt-16">

            {Array.from({
                length: totalPages,
            }).map((_, index) => (

                <button
                    key={index}
                    onClick={() =>
                        setPage(index)
                    }
                    className={`w-11 h-11 rounded-xl ${
                        page === index
                            ? "bg-[#8C5A1E] text-white"
                            : "bg-white border border-[#D9C187]"
                    }`}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
}