package ma.nextstepest.recomand_service.services;


import ma.nextstepest.recomand_service.dto.QuestionAnswer;
import ma.nextstepest.recomand_service.entity.DataSet;
import ma.nextstepest.recomand_service.repository.DataSetRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class DataSetService {
    private final DataSetRepository repository;

    public DataSetService(DataSetRepository repository) {
        this.repository = repository;
    }

    @Async("taskExecutor")
    @Transactional
    public void appendAnswerAsync(int author,List<QuestionAnswer> answers , String topFiliere){

        if (answers == null || answers.isEmpty()) {
            return;
        }

        String collectedAnswers = answers.stream()
                .map(QuestionAnswer::getAnswer)
                .filter(a -> a != null && !a.isBlank())
                .map(String::trim)
                .reduce((a, b) -> a + "," + b)
                .orElse("");

        Optional<DataSet> optional = repository.findByAuthorId(author);

        if (optional.isPresent()) {

            DataSet existing = optional.get();

            String updatedAnswer;

            if (existing.getAnswer() == null || existing.getAnswer().isBlank()) {
                updatedAnswer = collectedAnswers;
            } else {
                updatedAnswer = existing.getAnswer() + "," + collectedAnswers;
            }

            existing.setAnswer(updatedAnswer);
            existing.setTopMajor(topFiliere);

            repository.save(existing);

        } else {

            DataSet dataSet = new DataSet();
            dataSet.setAuthorId(author);
            dataSet.setAnswer(collectedAnswers);
            dataSet.setTopMajor(topFiliere);

            repository.save(dataSet);
        }
    }
}
