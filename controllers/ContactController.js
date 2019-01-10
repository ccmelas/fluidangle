const { Contact } = require('./../database/models/');

/**
 * Manages User Contacts
 */
class ContactController {
  /**
   * Stores a new contact
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async store(req, res) {
    req.body.user_id = req.user.id;
    const contact = await Contact.create(req.body);
    res.json({ message: 'Contact created successfully', contact });
  }

  /**
   * Updates a user's single contact
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async update(req, res) {
    const update = await Contact.update(
      req.body,
      { where: { user_id: req.user.id, id: req.params.contact_id }, returning: true }
    );

    const contact = update[1][0];

    if (!contact) {
      res.status(404);
    }

    res.json({ contact });
  }

  /**
   * Returns a user's contacts
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async index(req, res) {
    const contacts = await Contact.findAll({ where: { user_id: req.user.id } });
    res.json({ contacts });
  }

  /**
   * Returns a user's starred contacts
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async starred(req, res) {
    const contacts = await Contact.findAll({ where: { user_id: req.user.id, starred: true } });
    res.json({ contacts });
  }

  /**
   * Returns a user's single contact
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async show(req, res) {
    const contact = await Contact.findOne({
      where: { user_id: req.user.id, id: req.params.contact_id }
    });

    if (!contact) res.status('404');
    res.json({ contact });
  }

  /**
   * Stars a user's single contact
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async star(req, res) {
    const update = await Contact.update(
      { starred: true },
      { where: { user_id: req.user.id, id: req.params.contact_id }, returning: true }
    );

    const contact = update[1][0];

    if (!contact) {
      res.status(404);
    }

    res.json({ contact });
  }

  /**
   * Unstars a user's single contact
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async unstar(req, res) {
    const update = await Contact.update(
      { starred: false },
      { where: { user_id: req.user.id, id: req.params.contact_id }, returning: true }
    );

    const contact = update[1][0];

    if (!contact) {
      res.status(404);
    }

    res.json({ contact });
  }

  /**
   * Deletes a user's single contact
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async delete(req, res) {
    const contact = await Contact.destroy({
      where: { user_id: req.user.id, id: req.params.contact_id }
    });

    if (contact > 0) {
      return res.json({ message: 'Contact deleted successfully' });
    }

    return res.status(404).json({ message: 'Contact could not be deleted or does not exist' });
  }
}

module.exports = ContactController;
