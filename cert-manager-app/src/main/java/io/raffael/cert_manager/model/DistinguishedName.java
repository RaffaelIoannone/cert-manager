package io.raffael.cert_manager.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.security.auth.x500.X500Principal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class DistinguishedName {

    private String commonName;
    private String organization;
    private String organizationUnit;
    private String locality;
    private String state;
    private String country;

    public DistinguishedName(X500Principal principal) throws InvalidNameException {
        LdapName name = new LdapName(principal.getName());
        name.getRdns().forEach(rdn -> {
            switch (rdn.getType()) {
                case "CN" -> this.commonName = rdn.getValue().toString();
                case "O" -> this.organization = rdn.getValue().toString();
                case "OU" -> this.organizationUnit = rdn.getValue().toString();
                case "L" -> this.locality = rdn.getValue().toString();
                case "ST" -> this.state = rdn.getValue().toString();
                case "C" -> this.country = rdn.getValue().toString();
            }
        });
    }

    public X500Principal convertToPrincipal() {
        List<String> parts = new ArrayList<>();
        addIfNotEmpty(parts, "CN", commonName);
        addIfNotEmpty(parts, "O", organization);
        addIfNotEmpty(parts, "OU", organizationUnit);
        addIfNotEmpty(parts, "L", locality);
        addIfNotEmpty(parts, "ST", state);
        addIfNotEmpty(parts, "C", country);
        String principal = String.join(",", parts);
        return new X500Principal(principal);
    }

    private void addIfNotEmpty(List<String> parts, String prefix, String value) {
        if (value != null && !value.isEmpty()) parts.add(STR."\{prefix}=\{value}");
    }

}
