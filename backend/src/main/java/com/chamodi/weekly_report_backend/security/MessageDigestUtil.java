package com.chamodi.weekly_report_backend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

final class MessageDigestUtil {
    private MessageDigestUtil() {
    }

    static boolean constantTimeEquals(String left, String right) {
        return MessageDigest.isEqual(left.getBytes(StandardCharsets.UTF_8), right.getBytes(StandardCharsets.UTF_8));
    }
}
