package ma.nextstepest.recomand_service.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class TopFiliereResponse {

    @JsonAlias({"Top_Filiere", "top_filiere"})
    private List<FiliereDTO> top_filiere;

    public List<FiliereDTO> getTop_filiere() {
        return top_filiere;
    }

    public void setTop_filiere(List<FiliereDTO> top_filiere) {
        this.top_filiere = top_filiere;
    }
}