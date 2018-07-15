package utils;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/**
 * Provide methods for {@link String} encryption
 *
 * @author alexwilfriedo
 */
public class EncryptionUtility {

  private static final String AES_KEY =
      "8A9C38A5E8D19709B1C6E8CC70533B8968B25C099833922BBB0D2BBC92F660DF";

  /**
   * @param base {@link String} to encrypt
   * @return a SHA 256 String generate from base
   */
  public static String sha256From(String base) {
    MessageDigest digest;
    String encoded = null;

    try {
      digest = MessageDigest.getInstance("SHA-256");
      byte[] byteOfTextToHash = base.getBytes("UTF-8");
      byte[] hashedByteArray = digest.digest(byteOfTextToHash);
      encoded = Base64.encodeBase64String(hashedByteArray).replaceAll("/", "~");
    } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
      e.printStackTrace();
    }

    return encoded;
  }

  /**
   * Generate 4 Digits pin code
   */
  public static String randomizePinCode() {
    return String.valueOf((int) (Math.random() * 9000) + 1000);
  }

  public static String encrypt(String plainText, String key) throws Exception {
    byte[] clean = plainText.getBytes();

    // Generating IV.
    int ivSize = 16;
    byte[] iv = new byte[ivSize];
    SecureRandom random = new SecureRandom();
    random.nextBytes(iv);
    IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);

    // Hashing key.
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    digest.update(key.getBytes("UTF-8"));
    byte[] keyBytes = new byte[16];
    System.arraycopy(digest.digest(), 0, keyBytes, 0, keyBytes.length);
    SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");

    // Encrypt.
    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
    byte[] encrypted = cipher.doFinal(clean);

    // Combine IV and encrypted part.
    byte[] encryptedIVAndText = new byte[ivSize + encrypted.length];
    System.arraycopy(iv, 0, encryptedIVAndText, 0, ivSize);
    System.arraycopy(encrypted, 0, encryptedIVAndText, ivSize, encrypted.length);

    return DatatypeConverter.printHexBinary(encryptedIVAndText).toUpperCase();
  }

  public static String encrypt(String plainText) throws Exception {
    return encrypt(plainText, AES_KEY);
  }

  public static String decrypt(String encryptedIvTextHex, String key) throws Exception {
    int ivSize = 16;
    int keySize = 16;

    final byte[] encryptedIvTextBytes = DatatypeConverter.parseHexBinary(encryptedIvTextHex);

    // Extract IV.
    byte[] iv = new byte[ivSize];
    System.arraycopy(encryptedIvTextBytes, 0, iv, 0, iv.length);
    IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);

    // Extract encrypted part.
    int encryptedSize = encryptedIvTextBytes.length - ivSize;
    byte[] encryptedBytes = new byte[encryptedSize];
    System.arraycopy(encryptedIvTextBytes, ivSize, encryptedBytes, 0, encryptedSize);

    // Hash key.
    byte[] keyBytes = new byte[keySize];
    MessageDigest md = MessageDigest.getInstance("SHA-256");
    md.update(key.getBytes());
    System.arraycopy(md.digest(), 0, keyBytes, 0, keyBytes.length);
    SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");

    // Decrypt.
    Cipher cipherDecrypt = Cipher.getInstance("AES/CBC/PKCS5Padding");
    cipherDecrypt.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);
    byte[] decrypted = cipherDecrypt.doFinal(encryptedBytes);

    return new String(decrypted);
  }

  public static String decrypt(String encryptedIvTextHex) throws Exception {
    return decrypt(encryptedIvTextHex, AES_KEY);
  }
}
