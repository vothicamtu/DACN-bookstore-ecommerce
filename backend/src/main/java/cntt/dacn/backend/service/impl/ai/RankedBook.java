package cntt.dacn.backend.service.impl.ai;

import cntt.dacn.backend.entity.Book;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RankedBook {

    private Book book;

    private double score;
}
