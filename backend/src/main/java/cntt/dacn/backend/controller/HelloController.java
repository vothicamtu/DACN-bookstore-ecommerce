//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package cntt.dacn.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5176", allowCredentials = "true")
public class HelloController {
    public HelloController() {
    }

    @GetMapping({"/api/test"})
    public String hello() {
        return "Backend running";
    }
}
