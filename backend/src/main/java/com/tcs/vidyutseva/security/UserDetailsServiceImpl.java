package com.tcs.vidyutseva.security;

import com.tcs.vidyutseva.entity.UserAccount;
import com.tcs.vidyutseva.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserAccountRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount user = userRepo.findByUsername(username)
            .orElseGet(() -> userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username)));

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPasswordHash())
            .roles(user.getRole().name())
            .build();
    }
}
