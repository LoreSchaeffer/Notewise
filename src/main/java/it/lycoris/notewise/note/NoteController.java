package it.lycoris.notewise.note;

import it.lycoris.notewise.note.rest.NoteRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService noteService;
    private final NoteRepository noteRepository;

    public NoteController(NoteService noteService, NoteRepository noteRepository) {
        this.noteService = noteService;
        this.noteRepository = noteRepository;
    }

    @GetMapping("/{id}")
    public List<Note> getNotes(@PathVariable("id") UUID author) {
        return noteRepository.findAllByAuthorId(author);
    }

    @GetMapping()
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Note> createNote(HttpServletRequest request,  @RequestBody NoteRequest noteRequest) {
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(HttpServletRequest request, @RequestBody NoteRequest noteRequest) {
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable("id") Long id) {
        if (!noteRepository.existsById(id)) return ResponseEntity.notFound().build();

        noteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
