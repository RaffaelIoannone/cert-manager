package io.raffael.cert_manager.model;

import io.raffael.cert_manager.exception.UnsupportedTypeException;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bouncycastle.asn1.x509.GeneralName;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SubjectAlternativeName {

    @NotBlank
    private String type;

    @NotBlank
    private String value;

    public SubjectAlternativeName(List<?> parameters) {
        switch ((Integer) parameters.get(0)) {
            case 2 -> this.type = "DNS";
            case 7 -> this.type = "IP";
            default -> throw new UnsupportedTypeException();
        }
        this.value = (String) parameters.get(1);
    }

    public GeneralName toGeneralName() {
        int tag = switch (type) {
            case "DNS" -> GeneralName.dNSName;
            case "IP" -> GeneralName.iPAddress;
            default -> throw new UnsupportedTypeException();
        };
        return new GeneralName(tag, value);
    }

}
