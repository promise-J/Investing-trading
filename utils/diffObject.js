/**
 * 
 Returns the difference between two shallow objects
 i.e it returns properties of the new object that is not equal to that of the old object
 */

function diffObject(oldObj, newObj) {
  const diff = {};
  Object.keys(oldObj).forEach((prop) => {
    if (oldObj[prop] !== newObj[prop]) {
      diff[prop] = newObj[prop];
    }
  });
  return diff;
}

module.exports = diffObject;
