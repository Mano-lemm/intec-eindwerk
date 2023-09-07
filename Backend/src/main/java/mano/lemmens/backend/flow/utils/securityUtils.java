package mano.lemmens.backend.flow.utils;

import mano.lemmens.backend.models.entities.Code;
import org.jetbrains.annotations.Contract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

@Component
public final class securityUtils {
    private final String encryptionAlgorithm;
    private final String keyAlgorithm;

    public securityUtils(@Value("${ENCRYPTION_ALGO}") String encryptionAlgorithm,
                         @Value("${KEYSPEC_ALGO}") String keyAlgorithm){
        this.encryptionAlgorithm = encryptionAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
    }

    public record encryptionResults(String code, String salt, String Iv){}

    private byte[] generateSalt(){
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    public static IvParameterSpec generateIv() {
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    private SecretKey hash(char[] password, byte[] salt){
        PBEKeySpec spec = new PBEKeySpec(password, salt, 1, 256);
        try {
            SecretKeyFactory skf = SecretKeyFactory.getInstance(keyAlgorithm);
            return new SecretKeySpec(skf.generateSecret(spec).getEncoded(), "AES");
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new AssertionError("Error while hashing a password: " + e.getMessage(), e);
        } finally {
            spec.clearPassword();
        }
    }

    @Contract(pure = true)
    public encryptionResults encrypt(String code, String pwd){
        byte[] salt = generateSalt();
        IvParameterSpec iv = generateIv();
        SecretKey hashed = hash(pwd.toCharArray(), salt);
        try {
            Cipher cipher = Cipher.getInstance(encryptionAlgorithm);
            cipher.init(Cipher.ENCRYPT_MODE, hashed, iv);
            byte[] cipherText = cipher.doFinal(code.getBytes());
            return new encryptionResults(
                    Base64.getEncoder().encodeToString(cipherText),
                    Base64.getEncoder().encodeToString(salt),
                    Base64.getEncoder().encodeToString(iv.getIV()));
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidAlgorithmParameterException |
                 InvalidKeyException | IllegalBlockSizeException | BadPaddingException e) {
            throw new RuntimeException(e);
        }
    }

    public String decrypt(Code code, String pwd){
        byte[] salt = Base64.getDecoder().decode(code.getCodeSalt());
        IvParameterSpec iv = new IvParameterSpec(Base64.getDecoder().decode(code.getCodeIv()));
        SecretKey hashed = hash(pwd.toCharArray(), salt);
        try {
            Cipher cipher = Cipher.getInstance(encryptionAlgorithm);
            cipher.init(Cipher.DECRYPT_MODE, hashed, iv);
            byte[] cipherText = cipher.doFinal(Base64.getDecoder().decode(code.getCodeHash()));
            return new String(cipherText);
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidAlgorithmParameterException |
                 InvalidKeyException | IllegalBlockSizeException | BadPaddingException e) {
            throw new RuntimeException(e);
        }
    }
}
