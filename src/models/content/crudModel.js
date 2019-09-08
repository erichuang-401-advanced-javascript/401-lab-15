'use strict';

class ModelCRUD {

  /**
   * Takes a schema
   * @param schema
   */
  constructor( schema ) {
    this.schema = schema;
  }

  /**
   * Create a record
   * @param record
   * @returns {Promise|void|*}
   */
  create( record ) {
    // eslint-disable-next-line new-cap
    let newRecord = new this.schema( record );
    return newRecord.save();
  }

  /**
   * Get a record by ID or all records
   * @param id
   * @returns {Query|Promise|*|PromiseLike<{count: *, results: *}>|Promise<{count: *, results: *}>}
   */
  read( id ) {
    if ( id ) {
      return this.schema.findById( id );
    } else {
      return this.schema.find( {} )
        .then( results => {
          return {
            count: results.length,
            results: results,
          };
        });
    }
  }

  /**
   * Update a record by ID.
   * @param id
   * @param record
   * @returns {string|Query}
   */
  update( id, record ) {
    if ( id ) {
      return this.schema.findByIdAndUpdate( id, record, { new : true } );
    } else return 'Update: could not find ID.';
  }

  /**
   * Remove a record by ID.
   * @param id
   * @returns {string|Query}
   */
  remove( id ) {
    if ( id ) {
      return this.schema.findByIdAndDelete( id );
    } else return 'Delete: could not find ID.';
  }

}

module.exports = ModelCRUD;
