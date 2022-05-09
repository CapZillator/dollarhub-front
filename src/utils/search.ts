export const findCity = (city: string, cityList: Array<any>): Array<any> => {
    city = city.trim();
    let cityListResult: Array<any> = [];
    if (city.length > 0){
      let regexp = new RegExp(`${city}`, 'i');
      if (cityList.length){
          cityList.forEach((c: any) => {
            let result = c.name.match(regexp);
            if (result) cityListResult.push(c.name);
          });
      };
    };
    return cityListResult;
};