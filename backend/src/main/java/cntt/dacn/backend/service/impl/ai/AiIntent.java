package cntt.dacn.backend.service.impl.ai;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class AiIntent {

    private String name;

    private String query;

    private String author;

    private String publisher;

    private String category;

    private BigDecimal maxPrice;

    private boolean bestSeller;

    private boolean newest;

    private boolean clarificationNeeded;
}
