package ma.nextstepest.auth_service.dto.recomandation;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;


import java.util.List;

@Data
public class TopFiliereResponse {

    @JsonAlias({"Top_Filiere", "top_filiere"})
    private List<FiliereDTO> top_filiere;
    private String to_mail;

    public List<FiliereDTO> getTop_filiere() {
        return top_filiere;
    }

}