
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';


export const fetchPotentials = jest.fn().mockImplementation(async(params) => ({hits: []}))


export const fetchNewestBrowse = jest.fn().mockImplementation((params) => {
  return new Promise((resolve,reject) => {
    if(!params){
      reject('f')
    }
    resolve({hits: []})
  })

})

export const fetchPopularBrowse = jest.fn().mockImplementation(async(params) => { if(!params){ return new Error('')}; return ({hits: []})} )
export const fetchNearbyBrowse = jest.fn().mockImplementation(async(params) => ({hits: []}))
