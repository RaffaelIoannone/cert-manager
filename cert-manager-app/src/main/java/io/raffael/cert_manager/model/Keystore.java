package io.raffael.cert_manager.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document("keystores")
public class Keystore {

    @Id
    private String id;
    private String name;
    private String description;
    private List<KeystoreEntry> entries;

}
