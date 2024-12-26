package it.lycoris.notewise;

import it.lycoris.notewise.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class NoteWise {

    public static void main(String[] args) {
        SpringApplication.run(NoteWise.class, args);
    }
}
