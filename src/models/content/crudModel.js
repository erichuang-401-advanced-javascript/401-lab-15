'use strict';

class ModelCRUD {

  constructor( schema ) {
    this.schema = schema;
  }

  create( record ) {
    // eslint-disable-next-line new-cap
    let newRecord = new this.schema( record );
    return newRecord.save();
  }

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

  update( id, record ) {
    if ( id ) {
      return this.schema.findByIdAndUpdate( id, record, { new : true } );
    } else return 'Update: could not find ID.';
  }

  remove( id ) {
    if ( id ) {
      return this.schema.findByIdAndDelete( id );
    } else return 'Delete: could not find ID.';
  }

}

module.exports = ModelCRUD;
