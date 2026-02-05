package ma.nextstepest.qa_service.Exceptions;

public class QANotFoundException extends RuntimeException{
    public QANotFoundException(String message){
        super(message);
    }
}
