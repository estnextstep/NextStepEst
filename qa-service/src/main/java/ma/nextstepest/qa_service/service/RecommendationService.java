package ma.nextstepest.qa_service.service;


import ma.nextstepest.qa_service.dto.AllQuestionResponse;
import ma.nextstepest.qa_service.dto.AllrecQaResponse;
import ma.nextstepest.qa_service.dto.QuestionDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {
    @Autowired
    private ElasticsearchOperations elasticsearchOperations;
    public AllrecQaResponse getRecommendedQuestions(int page, int size,String major){
        NativeQuery query = NativeQuery.builder()
                .withQuery(q -> q.bool(b -> b
                        .minimumShouldMatch(String.valueOf(1))
                        .should(m -> m.match(match -> match
                                .field("keywords")
                                .query(major)
                                .fuzziness("AUTO")
                                .boost(3F)
                        ))
                        .should(m->m.match(match2 ->match2
                                .field("title")
                                .query(major)
                                .boost(2F)
                                .fuzziness("AUTO"))
                        )
                                .should(s -> s.match(m -> m
                                        .field("content")
                                        .query(major)
                                        .boost(1F)
                                        .fuzziness("AUTO")
                                ))

                        )
                )
                .withPageable(PageRequest.of(page, size))
                .build();
        SearchHits<QuestionDocument> searchHits=elasticsearchOperations.search(query, QuestionDocument.class);
        List<QuestionDocument> questions=searchHits.getSearchHits()
                .stream().map(SearchHit::getContent).toList();

        return new AllrecQaResponse(questions,searchHits.getTotalHits(),size);
    }
}
