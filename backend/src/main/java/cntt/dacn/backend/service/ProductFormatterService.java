package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.response.AiProductSuggestionResponse;
import cntt.dacn.backend.service.impl.ai.RankedBook;

import java.util.List;

public interface ProductFormatterService {

    List<AiProductSuggestionResponse> format(List<RankedBook> rankedBooks);
}
