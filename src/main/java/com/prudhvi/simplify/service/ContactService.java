package com.prudhvi.simplify.service;

import com.prudhvi.simplify.domain.Contact;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Contact}.
 */
public interface ContactService {
    /**
     * Save a contact.
     *
     * @param contact the entity to save.
     * @return the persisted entity.
     */
    Contact save(Contact contact);

    /**
     * Partially updates a contact.
     *
     * @param contact the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Contact> partialUpdate(Contact contact);

    /**
     * Get all the contacts.
     *
     * @return the list of entities.
     */
    List<Contact> findAll();

    /**
     * Get the "id" contact.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Contact> findOne(Long id);

    /**
     * Delete the "id" contact.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
