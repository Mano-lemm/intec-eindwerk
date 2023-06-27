package mano.lemmens.backend.flow.utils;

import mano.lemmens.backend.models.entities.Code;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class securityUtilsTest {
    @Autowired
    private securityUtils util;

    @CsvFileSource(resources = {"SecurityUtils.csv"})
    @ParameterizedTest
    void encryptCode(String code, String pwd) {
        securityUtils.encryptionResults results = util.encrypt(code, pwd);
        Code codeObj = new Code()
                .salt(results.salt())
                .code(results.code())
                .iv(results.Iv());
        assertAll(
                () -> assertEquals(code, util.decrypt(codeObj, pwd)),
                () -> assertNotEquals(code, codeObj.getCodeHash())
        );
    }
}