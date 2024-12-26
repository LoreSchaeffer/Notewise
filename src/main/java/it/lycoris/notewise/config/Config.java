package it.lycoris.notewise.config;

import it.lycoris.notewise.user.Role;
import it.lycoris.notewise.user.User;
import it.lycoris.notewise.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@Configuration
public class Config {
    private static final Logger LOG = LoggerFactory.getLogger(Config.class);
    private final UserRepository userRepository;

    public Config(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @EventListener(ContextRefreshedEvent.class)
    public void init() {
        if (userRepository.findAllByRole(Role.ADMIN).isEmpty()) {
            String password = UUID.randomUUID().toString();

            User user = new User("admin", passwordEncoder().encode(password), Role.ADMIN);
            userRepository.save(user);

            LOG.info("");
            LOG.info("===================================================>");
            LOG.info("Admin user created with the following credentials:\n\tUsername: {}\n\tPassword: {}", "admin", password);
            LOG.info("<===================================================");
            LOG.info("");
        }
    }
}
