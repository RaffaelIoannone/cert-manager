package io.raffael.cert_manager.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeystoreDTO {

    private String id;
    private String name;
    private String description;
    private List<KeystoreEntryDTO> entries;
}
