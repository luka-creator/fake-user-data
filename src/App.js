import React, { useState, useEffect, useCallback,useMemo } from 'react';
import { faker } from '@faker-js/faker';
import DataTable from './components/DataTable';
import ErrorControls from './components/ErrorControls';
import RegionSelector from './components/RegionSelector';
import SeedGenerator from './components/SeedGenerator';
import './App.css';

const regions = ['Poland', 'USA', 'Spain'];
const recordsPerPage = 20;

const App = () => {
  const [region, setRegion] = useState(regions[0]);
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState(0);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const regionConfig = useMemo(() => ({
    Poland: {
      generateName: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
      generateAddress: () => `${faker.address.city()}, ${faker.address.streetAddress()}`,
      generatePhone: () => faker.phone.number('+48 ### ### ###'),
    },
    USA: {
      generateName: () => `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`,
      generateAddress: () => faker.address.streetAddress(true),
      generatePhone: () => faker.phone.number('+1 (###) ###-####'),
    },
    Spain: {
      generateName: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
      generateAddress: () => `${faker.address.city()}, ${faker.address.streetAddress()}`,
      generatePhone: () => faker.phone.number('+34 ### ### ###'),
    },
  }), []);

  const generateName = useCallback((region) => regionConfig[region]?.generateName() || '', [regionConfig]);
  const generateAddress = useCallback((region) => regionConfig[region]?.generateAddress() || '', [regionConfig]);
  const generatePhone = useCallback((region) => regionConfig[region]?.generatePhone() || '', [regionConfig]);

  const generateData = useCallback((count, region, errors) => {
    const data = [];
    const nameCache = new Set();
    const addressCache = new Set();
    const phoneCache = new Set();

    for (let i = 0; i < count; i++) {
      const index = page * recordsPerPage + i + 1;
      let name, address, phone;

      do {
        name = generateName(region);
        address = generateAddress(region);
        phone = generatePhone(region);
      } while (
        nameCache.has(name) ||
        addressCache.has(address) ||
        phoneCache.has(phone)
      );

      nameCache.add(name);
      addressCache.add(address);
      phoneCache.add(phone);

      const identifier = faker.datatype.uuid();
      const record = { index, identifier, name, address, phone };
      data.push(applyErrors(record, errors));
    }

    return data;
  }, [generateName, generateAddress, generatePhone, page]);

  useEffect(() => {
    const randomSeed = seed + page;
    faker.seed(randomSeed);
    const newData = generateData(recordsPerPage, region, errors);
    setData(newData);
  }, [region, errors, seed, page, generateData]);

  const applyErrors = (record, errorRate) => {
    const { name, address, phone } = record;
    let errors = 0;
    const maxErrors = Math.floor(errorRate);

    const applyError = (str) => {
      if (errors >= maxErrors) return str;
      errors++;

      const errorType = Math.floor(Math.random() * 3);
      const position = Math.floor(Math.random() * str.length);

      switch (errorType) {
        case 0: // Delete character
          return str.slice(0, position) + str.slice(position + 1);
        case 1: // Add character
          const char = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
          return str.slice(0, position) + char + str.slice(position);
        case 2: // Swap characters
          if (position === str.length - 1) return str;
          const newStr = str.split('');
          [newStr[position], newStr[position + 1]] = [newStr[position + 1], newStr[position]];
          return newStr.join('');
        default:
          return str;
      }
    };

    return {
      ...record,
      name: applyError(name),
      address: applyError(address),
      phone: applyError(phone),
    };
  };

  return (
    <div id='contact-form'>
      <div id='table-container'>
        <RegionSelector
          region={region}
          regions={regions}
          onRegionChange={setRegion}
        />
        <ErrorControls
          errors={errors}
          onErrorsChange={setErrors}
        />
        <SeedGenerator
          seed={seed}
          onSeedChange={setSeed}
          onRandomSeed={() => setSeed(Math.floor(Math.random() * 1000000))}
        />
      </div>
      <DataTable
        data={data}
        onScroll={(event) => {
          const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
          if (bottom) {
            setPage(page + 1);
          }
        }}
      />
    </div>
  );
};

export default App;