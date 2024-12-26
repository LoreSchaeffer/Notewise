package it.lycoris.notewise.note;

import it.lycoris.notewise.user.User;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.Date;

@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String content;
    @ManyToOne
    @JoinColumn(name = "author", nullable = false)
    @Cascade(CascadeType.REMOVE)
    private User author;
    @Column(nullable = false, updatable = false)
    private Date createdAt;
    private Date updatedAt;

    public Note(String title, String content, User author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = new Date();
    }

    protected Note() {
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getAuthor() {
        return author;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
