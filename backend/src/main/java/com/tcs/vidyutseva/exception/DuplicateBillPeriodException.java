package com.tcs.vidyutseva.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateBillPeriodException extends RuntimeException {
    public DuplicateBillPeriodException(String message) {
        super(message);
    }
}
